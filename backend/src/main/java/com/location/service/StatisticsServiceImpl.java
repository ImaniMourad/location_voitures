package com.location.service;

import com.location.repository.StatisticsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @Override
    public double getTotalIncome() {
        return statisticsRepository.getTotalIncome();
    }

    @Override
    public int getReservations() {
        return statisticsRepository.getReservations();
    }

    @Override
    public int getActiveVehicles() {
        return 0;
    }

    @Override
    public double getOccupancyRate() {
        return 0;
    }

    @Override
    public List<Map<String, Object>> getMonthlyIncome() {
        return null;
    }

    @Override
    public List<Map<String, Object>> getVehicleRotation() {
        return null;
    }
}
